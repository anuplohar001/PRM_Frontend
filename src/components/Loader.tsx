import './Loader.css'
type LoaderProps = {
    loading: boolean
}

export default function Loader({ loading }: LoaderProps) {
    if (!loading) return null

    return (
        <div className="custom-loader-overlay">
            <div className="spinner-border spinner-grow text-primary loader-spinner" role="status"></div>
        </div>
    )
}