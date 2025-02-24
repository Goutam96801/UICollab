import { useState, useCallback, useRef, useEffect } from "react"



const ImageResizer = ({ image, onImageResized }) => {
  const containerRef = useRef(null)
  const imageRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [currentHandle, setCurrentHandle] = useState(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (imageRef.current) {
      const img = imageRef.current
      const updateDimensions = () => {
        setDimensions({ width: img.naturalWidth, height: img.naturalHeight })
        setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight })
      }

      if (img.complete) {
        updateDimensions()
      } else {
        img.onload = updateDimensions
      }
    }
  }, [imageRef]) // Updated dependency

  const startResize = useCallback((e, handle) => {
    e.preventDefault()
    setIsDragging(true)
    setCurrentHandle(handle)
  }, [])

  const handleResize = useCallback(
    (e) => {
      if (!isDragging || !containerRef.current || !currentHandle) return

      const container = containerRef.current.getBoundingClientRect()
      const aspectRatio = originalDimensions.width / originalDimensions.height

      let newWidth = dimensions.width
      let newHeight = dimensions.height

      switch (currentHandle) {
        case "top-left":
        case "bottom-left":
        case "left":
          newWidth = Math.max(50, container.right - e.clientX)
          newHeight = newWidth / aspectRatio
          break
        case "top-right":
        case "bottom-right":
        case "right":
          newWidth = Math.max(50, e.clientX - container.left)
          newHeight = newWidth / aspectRatio
          break
        case "top":
        case "bottom":
          newHeight = Math.max(50, Math.abs(e.clientY - container.top))
          newWidth = newHeight * aspectRatio
          break
      }

      setDimensions({ width: newWidth, height: newHeight })
    },
    [isDragging, currentHandle, dimensions, originalDimensions],
  )

  const stopResize = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      setCurrentHandle(null)
    }
  }, [isDragging])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleResize)
      window.addEventListener("mouseup", stopResize)
    }
    return () => {
      window.removeEventListener("mousemove", handleResize)
      window.removeEventListener("mouseup", stopResize)
    }
  }, [isDragging, handleResize, stopResize])

  const handleSave = useCallback(() => {
    const canvas = document.createElement("canvas")
    canvas.width = dimensions.width
    canvas.height = dimensions.height
    const ctx = canvas.getContext("2d")

    if (ctx && imageRef.current) {
      ctx.drawImage(imageRef.current, 0, 0, dimensions.width, dimensions.height)
      const resizedImage = canvas.toDataURL("image/jpeg")
      onImageResized(resizedImage)
    }
  }, [dimensions, onImageResized])

  return (
    <div className="flex flex-col items-center">
      <div
        ref={containerRef}
        className="relative inline-block"
        style={{
          width: dimensions.width,
          height: dimensions.height,
          maxWidth: "100%",
          maxHeight: "70vh",
        }}
      >
        <img
          ref={imageRef}
          src={image || "/placeholder.svg"}
          alt="Resize"
          className="w-full h-full object-contain"
          style={{ maxWidth: "100%", maxHeight: "70vh" }}
        />

        {/* Resize handles */}
        <div
          className="absolute left-0 top-0 w-3 h-3 bg-blue-500 cursor-nw-resize -translate-x-1/2 -translate-y-1/2"
          onMouseDown={(e) => startResize(e, "top-left")}
        />
        <div
          className="absolute left-1/2 top-0 w-3 h-3 bg-blue-500 cursor-n-resize -translate-x-1/2 -translate-y-1/2"
          onMouseDown={(e) => startResize(e, "top")}
        />
        <div
          className="absolute right-0 top-0 w-3 h-3 bg-blue-500 cursor-ne-resize translate-x-1/2 -translate-y-1/2"
          onMouseDown={(e) => startResize(e, "top-right")}
        />
        <div
          className="absolute right-0 top-1/2 w-3 h-3 bg-blue-500 cursor-e-resize translate-x-1/2 -translate-y-1/2"
          onMouseDown={(e) => startResize(e, "right")}
        />
        <div
          className="absolute right-0 bottom-0 w-3 h-3 bg-blue-500 cursor-se-resize translate-x-1/2 translate-y-1/2"
          onMouseDown={(e) => startResize(e, "bottom-right")}
        />
        <div
          className="absolute left-1/2 bottom-0 w-3 h-3 bg-blue-500 cursor-s-resize -translate-x-1/2 translate-y-1/2"
          onMouseDown={(e) => startResize(e, "bottom")}
        />
        <div
          className="absolute left-0 bottom-0 w-3 h-3 bg-blue-500 cursor-sw-resize -translate-x-1/2 translate-y-1/2"
          onMouseDown={(e) => startResize(e, "bottom-left")}
        />
        <div
          className="absolute left-0 top-1/2 w-3 h-3 bg-blue-500 cursor-w-resize -translate-x-1/2 -translate-y-1/2"
          onMouseDown={(e) => startResize(e, "left")}
        />
      </div>
      <div className="mt-4 flex gap-4">
        <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600">
          Apply Resize
        </button>
      </div>
    </div>
  )
}

export default ImageResizer

