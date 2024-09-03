import React from "react";

const Page = ({ params }: { params: { type: string; id: string, season:string, episode:string } }) => {
  const { type, id,season,episode } = params;

  let iframeSrc = '';

  try {
    iframeSrc =
      type === 'movie'
        ? `https://vidsrc.xyz/embed/movie/${id}`
        : type === 'tv'
        ? `https://vidsrc.xyz/embed/tv?imdb=${id}&season=${season}&episode=${episode}`
        : '';
    
        
    if (!iframeSrc) {
      throw new Error('Invalid type or ID');
    }
  } catch (error) {
    console.error('Error constructing iframe source:', error);
  }

  return (
    <div>
      {iframeSrc ? (
        <iframe
          src={iframeSrc}
          style={{ width: "100%", height: "80vh", padding: "2vw" }}
          frameBorder="0"
          allowFullScreen
        />
      ) : (
        <p>Error loading content. Please check the type and ID.</p>
      )}
    </div>
  );
};

export default Page;
