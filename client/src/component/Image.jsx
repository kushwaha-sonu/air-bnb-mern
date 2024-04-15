// eslint-disable-next-line react/prop-types
export default function Image({ src, ...rest }) {
    // eslint-disable-next-line react/prop-types
    src = src && src.includes('https://')
        ? src
        : 'https://air-bnb-mern-v7a1.vercel.app/api/upload-image/' + src;
    return (
        <img {...rest} src={src} alt={''}
            className="aspect-square cursor-pointer w-full h-full object-cover rounded-2xl" />
    );
}