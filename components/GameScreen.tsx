"use client";

import BottomPipe from "./BottomPipe";
import GameActions from "./GameActions";
import GameStatusModal from "./GameStatusModal";
import Score from "./Score";
import TopPipe from "./TopPipe";
import Bird from "./bird";

const GameScreen = () => {
  console.log("GameScreen");
  return (
    <main className="w-[400px] border-2 border-black mx-auto h-[640px] game relative overflow-hidden">
      <Score />
      <TopPipe />
      <Bird />
      <BottomPipe />
      <GameStatusModal />
      <GameActions />
    </main>
  );
};

export default GameScreen;
