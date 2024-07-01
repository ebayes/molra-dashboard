import { Bird, Bug, Leaf, PawPrint, Fish, Turtle } from "lucide-react";
import { GiDragonfly } from "react-icons/gi";
import { CgBee } from "react-icons/cg";
import { PiButterflyBold, PiButterflyDuotone } from "react-icons/pi";
import { LiaFrogSolid } from "react-icons/lia";

type LucideIcon = (props: React.SVGProps<SVGSVGElement>) => JSX.Element;

interface TaxaIcon {
    name: string;
    icon: LucideIcon;
    color: string;
}

export const taxaIcons = {
    birds: { name: "Birds", icon: Bird, color: "#A9DAED" },
    ants: { name: "Ants", icon: Bug, color: "#9CE0D0" },
    plants: { name: "Plants", icon: Leaf, color: "#D3E7A6" },
    amphibians: { name: "Amphibians", icon: LiaFrogSolid, color: "#FFE770" },
    odonates: { name: "Odonates", icon: GiDragonfly, color: "#FFD19A" },
    mammals: { name: "Mammals", icon: PawPrint, color: "#E1D9FF" },
    fishes: { name: "Fishes", icon: Fish, color: "#FFCDCE" },
    reptiles: { name: "Reptiles", icon: Turtle, color: "#E0E1E6" },
    butterflies: { name: "Butterflies", icon: PiButterflyBold, color: "#F0A1C1" },
    moths: { name: "Moths", icon: PiButterflyDuotone, color: "#B0A8B9" },
    bumblebees: { name: "Bumblebees", icon: CgBee, color: "#F4C542" },
    dragonflies: { name: "Dragonflies", icon: GiDragonfly, color: "#A1C4E9" },
};