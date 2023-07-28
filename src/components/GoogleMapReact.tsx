import GoogleMap from "google-maps-react-markers";
import { useRef, useState, MouseEvent, MouseEventHandler, ReactNode } from "react";

type MarkerProps = { markerId: string, lat: number, lng: number }

const testMarkers: MarkerProps[] = [
    {
        markerId: '1',
        lat: 45.4046987,
        lng: 12.2472504
    }
]

export const SimpleMap = (props: {button: string, buttonLat:number, buttonLng:number}) => {
    let {buttonLat, buttonLng, button} = props;
    buttonLat = Number(buttonLat)

    console.log(buttonLat)
    console.log(buttonLng)
    console.log(button)
    const realMarkers: MarkerProps[] = [{markerId: button, lat: buttonLat, lng: buttonLng}]
    const mapRef = useRef<google.maps.Map | null>(null)
    const [mapReady, setMapReady] = useState(false)
    const [markers, setMarkers] = useState<MarkerProps[]>(realMarkers)

    const onGoogleApiLoaded = (evt: { map: google.maps.Map }) => {
        mapRef.current = evt.map
        setMapReady(true)
    }

    const onMarkerClick = (evt: MouseEvent, markerProps: MarkerProps) => {
        const { markerId, lat, lng } = markerProps
        console.log('This is ->', markerId)

        if (!mapRef.current) return

        // inside the map instance you can call any google maps method
        mapRef.current.setCenter({ lat, lng })
        // ref. https://developers.google.com/maps/documentation/javascript/reference/map?hl=en#Map
    }

    // ref. https://developers.google.com/maps/documentation/javascript/reference/map?hl=en#MapOptions
    const mapOptions: google.maps.MapOptions = {
        center: { lat: buttonLat, lng: buttonLng },
    }

    return (
        <>
            {mapReady && <div>Map is ready. See for logs in developer console.</div>}
            <GoogleMap
                apiKey="AIzaSyCu7fzCPB-moLd6BgUZPMYUMoTQZnc8Z6k"
                defaultCenter={{ lat: buttonLat, lng: buttonLat }}
                defaultZoom={14}
                options={mapOptions}
                mapMinHeight="50vh"
                onGoogleApiLoaded={onGoogleApiLoaded}
                onChange={(map: google.maps.Map) => console.log('Map moved', map)}
            >
                {markers.map((markerProps: MarkerProps, index: number) => {
                    const { lat, lng, markerId } = {markerId: button, lat: buttonLat, lng: buttonLng}
                    console.log(markers)
                    if (!mapRef.current) {
                        return
                    }
                    mapRef.current.setCenter({ lat, lng })
                    return (
                        <Marker key={index} lat={buttonLat} lng={buttonLng} markerId={button} onClick={(evt: MouseEvent) => onMarkerClick(evt, markerProps)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor"
                                 className="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                                <path
                                    d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                            </svg>
                        </Marker>
                    )
                })}
            </GoogleMap>
        </>
    )
}

export const Marker = (props: MarkerProps & {onClick: MouseEventHandler, children?: ReactNode}) => {
    const { children, onClick } = props
    return (
        <div onClick={onClick} className={"text-red-600 text-3xl font-bold"}>
            {children}
        </div>
    )
}