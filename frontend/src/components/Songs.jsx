/*The props are the values inside the function*/
export default function Songs({songs}) {
    // Always use a unique key properties for elements inside a map
    return (
        <div>
            <ul>
                {songs.map((song, index) => (<li>{index +1}:
            {song.name} by {song.artist}
        </li>))}
        </ul>
        </div>
    )
}