import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { Howl } from 'howler'
import helper from '@/includes/helper'

export const usePlayerStore = defineStore('player', () => {
  const currentSong = ref({})
  const sound = ref({})
  const seek = ref('00:00')
  const duration = ref('00:00')
  const playerProgress = ref('0%')

  function progress() {
    seek.value = helper.formatTime(sound.value.seek())
    duration.value = helper.formatTime(sound.value.duration())
    playerProgress.value = `${(sound.value.seek() / sound.value.duration()) * 100}%`

    if (sound.value.playing()) {
      requestAnimationFrame(progress)
    }
  }

  function updateSeek(event) {
    if (!sound.value.playing) {
      return
    }

    const { x, width } = event.currentTarget.getBoundingClientRect()

    const clickX = event.clientX - x
    const percentage = clickX / width
    const sec = sound.value.duration() * percentage
    sound.value.seek(sec)
    sound.value.once('seek', progress)
  }

  async function newSong(song) {
    if (sound.value instanceof Howl) {
      sound.value.unload()
    }
    currentSong.value = song

    sound.value = new Howl({
      src: [song.url],
      html5: true
    })

    sound.value.play()

    sound.value.on('play', () => {
      requestAnimationFrame(progress)
    })
  }

  async function toggleAudio() {
    if (!sound.value.playing) {
      return
    }

    if (sound.value.playing()) {
      sound.value.pause()
    } else {
      sound.value.play()
    }
  }

  const isPlaying = computed(() => {
    return sound.value.playing ? sound.value.playing() : false
  })

  return {
    currentSong,
    newSong: newSong,
    toggleAudio,
    isPlaying,
    seek,
    duration,
    playerProgress,
    updateSeek
  }
})
