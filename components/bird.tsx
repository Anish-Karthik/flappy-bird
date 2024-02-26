"use client"
import { useGameState } from '@/hooks/use-game'
import Image from 'next/image'
import React from 'react'

const Bird = () => {
  const { birdImage, birdSize, birdCoords, top } = useGameState()
  console.log(birdImage)
  return (
    <Image src={birdImage} width={birdSize.x * 2} height={birdSize.y * 2} alt="bird" style={{
      position: 'absolute',
      top: top - birdCoords.y,
      left: birdCoords.x
    }} />
  )
}

export default Bird