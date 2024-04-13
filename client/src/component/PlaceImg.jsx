// import Image from "./Image.jsx";

import Image from "./Image";

// eslint-disable-next-line react/prop-types, no-unused-vars
export default function PlaceImg({place,index=0,className=null}) {
    // eslint-disable-next-line react/prop-types
    if (!place.photos?.length) {
        return '';
    }
    if (!className) {
        className = 'object-cover w-full h-full';
    }
    return (

        // eslint-disable-next-line react/prop-types
        // <img className="object-cover w-full h-full rounded-2xl" src={'http://localhost:4000/api/upload-image/'+place.photos[0]} alt='img' />
        // eslint-disable-next-line react/prop-types
        <Image className={className} src={place.photos[index]} alt=""/>

    );
}