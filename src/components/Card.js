import placeholderImage from "../assets/placeholder_for_missing_posters.png";

export const Card = ({ data }) => {
  const onImageError = (e) => {
    e.target.src = placeholderImage;
  };

  return (
    <div className="w-full rounded overflow-hidden shadow-lg m-2">
      <img
        className="w-full h-64 object-center"
        src={`/${data["poster-image"]}`}
        alt=""
        onError={onImageError}
      />
      <div className="px-6 py-4">
        <div
          className={`list-name 
          }`}
        >
          {data?.name}
        </div>
      </div>
    </div>
  );
};
