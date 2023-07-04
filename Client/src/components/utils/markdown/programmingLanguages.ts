import { IconType } from "react-icons";
import { SiRuby, SiElixir, SiGraphql, SiDart, SiHaskell, SiKotlin, SiPhp, SiPython, SiGnubash, SiSwift, SiTypescript, SiC } from "react-icons/si";
import { TbBrandCSharp, TbBrandCpp, TbBrandGolang, TbSql } from "react-icons/tb";
import { DiFsharp, DiJavascript1 } from "react-icons/di";
import { FaCss3, FaDocker, FaHtml5, FaJava, FaRust } from "react-icons/fa";

const programmingLanguages: { name: string, icon: IconType, color: string }[] = [
    { name: "bash", icon: SiGnubash, color: "#4EAA25" },
    { name: "c", icon: SiC, color: "#A8B9CC" },
    { name: "csharp", icon: TbBrandCSharp, color: "#9A4993" },
    { name: "cpp", icon: TbBrandCpp, color: "#00599C" },
    { name: "css", icon: FaCss3, color: "#1572B6" },
    { name: "dart", icon: SiDart, color: "#0175C2" },
    { name: "dockerfile", icon: FaDocker, color: "#2496ED" },
    { name: "elixir", icon: SiElixir, color: "#4B275F" },
    { name: "fsharp", icon: DiFsharp, color: "#378BBA" },
    { name: "go", icon: TbBrandGolang, color: "#00ADD8" },
    { name: "graphql", icon: SiGraphql, color: "#E10098" },
    { name: "haskell", icon: SiHaskell, color: "#5D4F85" },
    { name: "html", icon: FaHtml5, color: "#E34F26" },
    { name: "java", icon: FaJava, color: "#007396" },
    { name: "javascript", icon: DiJavascript1, color: "#F7DF1E" },
    { name: "kotlin", icon: SiKotlin, color: "#0095D5" },
    { name: "php", icon: SiPhp, color: "#777BB4" },
    { name: "python", icon: SiPython, color: "#3776AB" },
    { name: "ruby", icon: SiRuby, color: "#CC342D" },
    { name: "rust", icon: FaRust, color: "#000000" },
    { name: "sql", icon: TbSql, color: "#00758F" },
    { name: "swift", icon: SiSwift, color: "#FA7343" },
    { name: "typescript", icon: SiTypescript, color: "#3178C6" }
];

export default programmingLanguages;
