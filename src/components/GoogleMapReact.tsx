import React from "react";
import GoogleMapReact from 'google-map-react';

interface AnyReactComponentProps {
    text: string;
    lat: number;
    lng: number;
}

const AnyReactComponent = ({ text }: AnyReactComponentProps) => <div>{text}</div>;

export default function SimpleMap(){
    const defaultProps = {
        center: {
            lat: 10.99835602, //replace with lat and lng for button address
            lng: 77.01502627
        },
        zoom: 11
    };

    return (
        // Important! Always set the container height explicitly
        <div style={{ height: '100vh', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg" }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
            >
                <AnyReactComponent
                    lat={59.955413}
                    lng={30.337844}
                    text="My Marker"
                />
            </GoogleMapReact>
        </div>
    );
}


//
// const handleApiLoaded = (map:object, maps:object) => {
//     // use map and maps objects
// };
//
//
// <GoogleMapReact
//     bootstrapURLKeys={{ key: "AIzaSyBnKZLeLQvXat0WSFLFwTLbXDKpY0H_BuA" }}
//     defaultCenter={this.props.center}
//     defaultZoom={this.props.zoom}
//     yesIWantToUseGoogleMapApiInternals
//     onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
// >
//     <AnyReactComponent
//         lat={59.955413}
//         lng={30.337844}
//         text="My Marker"
//     />
// </GoogleMapReact>
