import { useState, useEffect, useCallback, useRef } from 'react';
const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL
interface Activity {
    id: number;
    actorId: number;
    action: string;
    module: string;
    entityId?: number;
    entityType?: string;
    projectId?: number;
    metadata?: any;
    createdAt: string;
    actor: {
        id: number;
        name: string;
        email: string;
        avatar?: string;
    };
    project?: {
        id: number;
        name: string;
    };
}

export function useRealtimeActivities(projectId?: number) {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const eventSourceRef = useRef<EventSource | null>(null);

    // Fetch initial activities
    const fetchActivities = useCallback(async () => {
        try {
            setIsLoading(true);
            const url = projectId
                ? `/activities?projectId=${projectId}&limit=50`
                : '/activities?limit=50';

            const response = await fetch(`${BASE_URL}${url}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Your auth token
                },
            });

            const data = await response.json();
            setActivities(data.activities);
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    // Setup SSE connection
    useEffect(() => {
        fetchActivities();

        const token = localStorage.getItem('token');
        const eventSource = new EventSource(
            `${BASE_URL}/activities/stream?token=${token}`, // Or use cookies
            { withCredentials: true }
        );

        eventSource.onopen = () => {
            console.log('SSE connection established');
            setIsConnected(true);
        };

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'connected') {
                    console.log('Connected with client ID:', data.clientId);
                    return;
                }

                // Filter by projectId if specified
                if (projectId && data.projectId !== projectId) {
                    return;
                }

                // Add new activity to the top
                setActivities((prev) => [data, ...prev]);
            } catch (error) {
                console.error('Error parsing SSE message:', error);
            }
        };

        eventSource.onerror = (error) => {
            console.error('SSE error:', error);
            setIsConnected(false);
            eventSource.close();

            // Retry connection after 5 seconds
            setTimeout(() => {
                console.log('Attempting to reconnect...');
                window.location.reload(); // Or implement custom reconnect logic
            }, 5000);
        };

        eventSourceRef.current = eventSource;

        return () => {
            eventSource.close();
            setIsConnected(false);
        };
    }, [projectId, fetchActivities]);

    return {
        activities,
        isLoading,
        isConnected,
        refresh: fetchActivities,
    };
}