interface cardProps {
    imageUrl: string | null
}

const Card = ({ imageUrl }: cardProps) => {

    if (!imageUrl) {
        return <span>Loading........</span>
    }

    return (
        <>
            <div>
                <figure>
                    <img src={imageUrl} alt="" />
                </figure>
                <span>name: java</span>
            </div>

        </>
    )
}

export default Card;




