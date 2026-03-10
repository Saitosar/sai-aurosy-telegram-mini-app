import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import type { StoreItem } from "shared";
import { ConditionalAuthGuard } from "../auth/auth.guard";

const MOCK_ITEMS: StoreItem[] = [
  {
    id: "agibot-a2",
    type: "robot",
    name: "AGIBOT A2",
    model: "Service & Interaction Robot",
    description:
      "AGIBOT A2 is an intelligent service robot designed to interact with people and assist in public and commercial environments. It can see, hear, speak, and move autonomously, allowing it to greet visitors, provide information, and guide people in places such as shopping malls, museums, and offices.",
    specs: [
      "Human Interaction — communicates with people through voice, visual recognition, and expressive behavior",
      "Autonomous Navigation — moves independently in indoor environments and avoids obstacles while following routes",
      "Visitor Assistance — greets guests, answers questions, and guides people to locations",
      "Environmental Perception — uses cameras and sensors to detect people and understand its surroundings",
      "Connectivity — can connect to external platforms to receive tasks and send operational data",
    ],
    imageUrl: "/agibot-a2.png",
  },
  {
    id: "agibot-a2-w",
    type: "robot",
    name: "AGIBOT A2-W",
    model: "Mobile Service Robot",
    description:
      "AGIBOT A2-W is a mobile service robot designed to interact with people and assist in public and commercial environments. It combines autonomous mobility with AI-based interaction, allowing it to greet visitors, provide information, and guide people in places such as malls, museums, and exhibition spaces.",
    specs: [
      "Human Interaction — communicates with people through voice and visual recognition to answer questions and provide assistance",
      "Autonomous Navigation — moves independently through indoor environments while avoiding obstacles and following routes",
      "Visitor Assistance — can greet guests, provide directions, and present information or announcements",
      "Environmental Awareness — uses cameras and sensors to detect people and understand its surroundings",
      "Connected Operation — integrates with external platforms to receive tasks, send status updates, and support remote monitoring",
    ],
    imageUrl: "/agibot-a2-w.png",
  },
  {
    id: "agibot-x2",
    type: "robot",
    name: "AGIBOT X2",
    model: "Human-Interaction Robot",
    description:
      "AGIBOT X2 is an intelligent service robot designed to interact naturally with people. It can see, hear, speak, move, and respond to human actions in real environments. The robot combines cameras, microphones, speakers, and motion control to create a natural human-robot interaction experience.",
    specs: [
      "Voice interaction — understands speech and responds verbally",
      "Visual recognition — detects people and objects using cameras",
      "Touch interaction — responds to physical input",
      "Facial expression and gestures — expresses emotions and reactions",
    ],
    imageUrl: "/agibot-x2.png",
  },
  {
    id: "agibot-g2",
    type: "robot",
    name: "AGIBOT G2",
    model: "Humanoid Service Robot",
    description:
      "AGIBOT G2 is a humanoid robot designed for advanced interaction and service tasks in public and commercial environments. It combines human-like movement with AI capabilities to communicate with people, perform demonstrations, and assist visitors in places such as malls, exhibitions, and educational venues.",
    specs: [
      "Human-Like Interaction — communicates with people using voice, gestures, and expressive movements",
      "Humanoid Mobility — moves with a human-like body structure, enabling natural presence and interaction in public spaces",
      "Visitor Assistance — can greet visitors, answer questions, provide guidance, and present information",
      "Perception and Awareness — uses cameras and sensors to detect people, recognize surroundings, and respond to environmental changes",
      "Connected Operation — can connect to external platforms to receive commands, send status data, and support remote monitoring or control",
    ],
    imageUrl: "/agibot-g2.png",
  },
  {
    id: "agibot-c5",
    type: "robot",
    name: "AGIBOT C5",
    model: "Autonomous Cleaning Robot",
    description:
      "AGIBOT C5 is an autonomous cleaning robot designed for maintaining large indoor spaces such as malls, airports, offices, and commercial facilities. It operates independently to clean floors while navigating safely around people and obstacles.",
    specs: [
      "Autonomous Cleaning — performs automated floor cleaning tasks with minimal human intervention",
      "Smart Navigation — moves through indoor environments while detecting obstacles and optimizing cleaning routes",
      "Environmental Awareness — uses sensors to understand surroundings and operate safely in public spaces",
      "Efficient Operation — designed for continuous cleaning in large facilities to maintain hygiene and operational efficiency",
      "Connected Management — can connect to management platforms for monitoring, task scheduling, and operational reporting",
    ],
    imageUrl: "/agibot-c5.png",
  },
  {
    id: "agibot-d1",
    type: "robot",
    name: "AGIBOT D1",
    model: "Autonomous Delivery Robot",
    description:
      "AGIBOT D1 is an autonomous delivery robot designed to transport items efficiently within indoor environments. It can navigate through buildings such as hotels, offices, hospitals, and shopping centers to deliver goods quickly and safely.",
    specs: [
      "Autonomous Navigation — moves independently through indoor spaces while avoiding obstacles and following optimal routes",
      "Delivery Automation — transports items such as packages, food, or documents between locations",
      "Environmental Awareness — uses sensors and cameras to understand its surroundings and operate safely around people",
      "User Interaction — allows users to send delivery requests and receive items through a simple interface",
      "Connected Operation — can connect to management platforms to receive delivery tasks, report status, and monitor operations",
    ],
    imageUrl: "/agibot-d1.png",
  },
];

@Controller("store")
@UseGuards(ConditionalAuthGuard)
export class StoreController {

  /**
   * Store: Platform has no store API (Marketplace Phase 3.4). Always use mock.
   */
  @Get("items")
  async listItems(): Promise<StoreItem[]> {
    return MOCK_ITEMS;
  }

  @Get("items/:id")
  async getItem(@Param("id") id: string): Promise<StoreItem> {
    const item = MOCK_ITEMS.find((i) => i.id === id);
    if (!item) throw new NotFoundException("Item not found");
    return item;
  }

  @Post("items/:id/acquire")
  async acquire(): Promise<{ success: boolean }> {
    return { success: true };
  }
}
