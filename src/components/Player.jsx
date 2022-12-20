import React, { useEffect, useState } from "react";
import useSound from "use-sound"; // for handling the sound
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai"; // icons for play and pause
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { VscUnmute } from "react-icons/vsc";
import { IoVolumeMuteOutline } from "react-icons/io5";
import { IconContext } from "react-icons"; // for customazing the icons
import "./Player.css";
import { audioPlayer } from "./audio";
import { ColorRing } from "react-loader-spinner";

const Player = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mute, setMute] = useState(false);
  const [currentSong, setCurrentSong] = useState(audioPlayer[0]);
  const [play, { pause, duration, sound, stop }] = useSound(currentSong.url);

  const [currTime, setCurrTime] = useState({
    min: 0,
    sec: 0,
  }); // current position of the audio in minutes and seconds
  const [time, setTime] = useState({
    min: 0,
    sec: 0,
  });
  const [loading, setLoading] = useState(false);

  const [seconds, setSeconds] = useState(0); // current position of the audio in seconds

  const playingButton = () => {
    if (isPlaying) {
      pause(); // this will pause the audio
      setIsPlaying(false);
    } else {
      play(); // this will play the audio
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (sound) {
        setSeconds(sound.seek()); // setting the seconds state with the current state
        const min = Math.floor(sound.seek() / 60);
        const sec = Math.floor(sound.seek() % 60);
        setCurrTime({
          min,
          sec,
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [sound]);

  useEffect(() => {
    const sec = duration / 1000;
    const min = Math.floor(sec / 60);
    const secRemain = Math.floor(sec % 60);
    setTime({
      min: min,
      sec: secRemain,
    });
  }, [isPlaying, duration]);

  // useEffect(() => {
  //   const onPageLoading = () => {
  //     setLoading(true);
  //   }});

  const prevAudio = () => {
    const index = audioPlayer.findIndex((x) => x.title === currentSong.title);
    if (index === 0) {
      setCurrentSong(audioPlayer[audioPlayer.length - 1]);
    } else {
      setCurrentSong(audioPlayer[index - 1]);
    }
    setCurrTime(0);
    setIsPlaying(false);
    stop();
    // playingButton();
  };

  const nextAudio = () => {
    const index = audioPlayer.findIndex((x) => x.title === currentSong.title);
    if (index === audioPlayer.length - 1) {
      setCurrentSong(audioPlayer[0]);
    } else {
      setCurrentSong(audioPlayer[index + 1]);
    }
    setCurrTime(0);
    setIsPlaying(false);
    stop();
    // playingButton();
  };

  return (
    <div
      style={{
        background: `url(${currentSong.imageSrc})`,
        // backgroundSize: 'cover',
        // backgroundRepeat: 'no-repeat',
        // overflow: 'hidden',
      }}
      className="body"
    >
      <div className="bgBlur">
        <div className="component">
          <h2>Playing Now</h2>
          <div>
            {document.readyState === "interactive" ? (
              <div>
                <ColorRing
                  visible={true}
                  height="300"
                  width="180"
                  ariaLabel="blocks-loading"
                  wrapperStyle={{}}
                  wrapperClass="blocks-wrapper"
                  colors={[
                    "#e15b64",
                    "#f47e60",
                    "#f8b26a",
                    "#abbd81",
                    "#849b87",
                  ]}
                />
                <p className="loading-text">Loading Music...</p>
              </div>
            ) : (
              <img
                className="musicCover"
                src={currentSong.imageSrc}
                alt="cover pic"
              />
            )}
            <h3 className="title"> {currentSong.title} </h3>
            <p className="subTitle">{currentSong.subTitle}</p>
          </div>

          <div>
            <div className="time">
              <p>
                {currTime.min || 0}:{currTime.sec || 0}
              </p>
              <p>
                {time.min}:{time.sec}
              </p>
            </div>
            {isPlaying && mute ? (
              <button
                onClick={() => {
                  sound.volume(1);
                  setMute(false);
                }}
                className="muteBtn2"
              >
                <IoVolumeMuteOutline />
              </button>
            ) : (
              <button
                onClick={() => {
                  sound.volume(0);
                  setMute(true);
                }}
                className="muteBtn"
              >
                <VscUnmute />
              </button>
            )}
            <input
              type="range"
              min={0}
              max={duration / 1000}
              default={0}
              value={seconds}
              className="timeline"
              onChange={(e) => {
                sound.seek([e.target.value]);
              }}
            />
          </div>

          <div className="btns">
            <button
              onClick={() => {
                prevAudio();
              }}
              className="playButton"
            >
              <IconContext.Provider value={{ size: "3em", color: " #fff" }}>
                <BiSkipPrevious />
              </IconContext.Provider>
            </button>
            {!isPlaying ? (
              <button className="playButton" onClick={playingButton}>
                <IconContext.Provider value={{ size: "3em", color: "#fff" }}>
                  <AiFillPlayCircle />
                </IconContext.Provider>
              </button>
            ) : (
              <button className="playButton" onClick={playingButton}>
                <IconContext.Provider value={{ size: "3em", color: "#fff" }}>
                  <AiFillPauseCircle />
                </IconContext.Provider>
              </button>
            )}
            <button onClick={nextAudio} className="playButton">
              <IconContext.Provider value={{ size: "3em", color: "#fff" }}>
                <BiSkipNext />
              </IconContext.Provider>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
