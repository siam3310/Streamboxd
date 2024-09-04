import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="pt-10 pb-5">
      <footer className="bg-black text-white">
        <div className="w-full max-w-screen-xl mx-auto  md:py-8">
          <div className="flex flex-row items-center gap-4 justify-center">
            <p className="text-xs px-2 text-center text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Streamboxd
            </p>
           
            {/* <p className="text-xs px-2 text-center text-gray-500 dark:text-gray-400">
              This site does not store any
              files on the server, it is only linked to the media which is hosted
              on 3rd party services.
            </p> */}
            
            <ul className="flex space-x-4 text-sm font-medium">
              <li>
                <a
                  href="https://github.com/ADITYA-PATIL-git/Streamboxd"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub size={24} />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
