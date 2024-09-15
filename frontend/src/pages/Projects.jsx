import { useState } from "react";
import { Button } from "flowbite-react";

function Projects() {
  const [projects, setProjects] = useState([
    {
      title: "Mern Auth",
      live: "https://mern-auth-1-0c7x.onrender.com/",
      github: "https://github.com/Ritesh9919/mern_auth",
      img: "https://tse1.mm.bing.net/th?id=OIP.2D5SaWSma8uE_yal7-sM6wHaFj&pid=Api&P=0&h=180",
    },
    {
      title: "Mern Blog",
      live: "https://mern-auth-1-0c7x.onrender.com/",
      github: "https://github.com/Ritesh9919/mern_blog",
      img: "https://tse4.mm.bing.net/th?id=OIP.ZYAo10aHAottBKSWPWWLwQHaEW&pid=Api&P=0&h=180",
    },
  ]);
  return (
    <>
      <h1 className="my-10 font-bold text-center text-2xl font-serif">
        Projects
      </h1>
      <div className=" w-full mx-auto flex flex-wrap gap-5 justify-center items-center my-5">
        {projects.map((project) => (
          <div className="w-[250px] h-[300px] py-5 px-2 border-2 rounded-xl flex flex-col gap-5 items-center hover:w-[245px] transition-all duration-300">
            <div className="h-[200px]">
              <img src={project.img} alt="" className="w-full" />
            </div>
            <h2 className="font-bold text-md font-serif">{project.title}</h2>
            <div className="flex gap-7 justify-center items-center">
              <Button size="xs" gradientDuoTone={"purpleToBlue"} outline>
                <a href={project.live} target="_blank">
                  Live Demo
                </a>
              </Button>
              <Button size="xs" gradientDuoTone={"purpleToBlue"} outline>
                <a href={project.github} target="_blank">
                  Github Link
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Projects;
