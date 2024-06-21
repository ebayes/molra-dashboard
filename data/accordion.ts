import { Bird, PanelRightClose, Layers, Image as ImageIcon, Video, Activity, GripVertical, Code, Crop, Crosshair, Tags } from "lucide-react";

export const accordionData = [
    {
      value: "item-1",
      title: "Input",
      color: "#4285F4",
      icon: { component: Layers, className: "w-4 h-4" },
      buttons: [
        { id: "image-button", icon: { component: ImageIcon, className: "w-4 h-4 mr-3 inline" }, label: "Image" },
        { id: "audio-button", icon: { component: Activity, className: "w-4 h-4 mr-3 inline" }, label: "Audio" },
        { id: "video-button", icon: { component: Video, className: "w-4 h-4 mr-3 inline" }, label: "Video" },
      ],
    },
    {
      value: "item-2",
      title: "Model",
      color: "#5BB974",
      icon: { component: Layers, className: "w-4 h-4" },
      buttons: [
        { id: "detect-button", icon: { component: Crosshair, className: "w-4 h-4 mr-3 inline" }, label: "Detect" },
        { id: "classify-button", icon: { component: Tags, className: "w-4 h-4 mr-3 inline" }, label: "Classify" },
      ],
    },
    {
      value: "item-3",
      title: "Preprocessing",
      color: "#F9AB00",
      icon: { component: Layers, className: "w-4 h-4" },
      buttons: [
        { id: "format-button", icon: { component: Crop, className: "w-4 h-4 mr-3 inline" }, label: "Format" },
      ],
    },
    {
      value: "item-4",
      title: "Custom",
      color: "#FF8BCB",
      icon: { component: Layers, className: "w-4 h-4" },
      buttons: [
        { id: "code-snippet-button", icon: { component: Code, className: "w-4 h-4 mr-3 inline" }, label: "Code Snippet" },
      ],
    },
  ];