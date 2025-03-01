import { Sign } from "@/app/components/SignInUp/Sign";
//import Image from "next/image";
// import Upload from "@/app/components/Upload/Upload"
// import ModelViewer from "@/app/components/ModelViewer/ModelViewer"
// import DehazePage from "@/app/components/Dehaze/Dehaze"
export default function Home() {
  return (
    <main >
    {/* <Navbar/> */}
    <div className="container mt-12 mx-auto px-12 py-4">
    <Sign/>
    {/* <Upload/> */}
    {/* <ModelViewer modelPath={`http://127.0.0.1:5000/static/output_modell.stl`}/> */}
    {/* <DehazePage/> */}
    
    </div>
    {/* <Footer/> */}
    </main>
  );
}
