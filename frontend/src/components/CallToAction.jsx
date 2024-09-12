import { Button } from "flowbite-react";

function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-4 border border-teal-500 justify-center items-start gap-4 rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 flex flex-col">
        <h1 className="text-2xl">Want to learn more about JavaScript</h1>
        <p className="text-gray-500 my-2">
          Check out this resources with 100 JavaScript projects
        </p>
        <Button gradientDuoTone={"purpleToPink"}>
          <a href="https://100jsprojects.com" target="_blank">
            100 JavaScript projects
          </a>
        </Button>
      </div>
      <div className="flex-1">
        <img
          src="https://tse1.mm.bing.net/th?id=OIP.-HHfqZ3bGRsZbIh8uZVu2AHaD4&pid=Api&P=0&h=180"
          alt=""
        />
      </div>
    </div>
  );
}

export default CallToAction;
