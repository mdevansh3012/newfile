import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #ffeff4 0%, #ffd1dc 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    position: "relative",
    overflow: "hidden",
  },
  card: {
    maxWidth: "800px",
    width: "100%",
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    overflow: "hidden",
    position: "relative",
  },  
  header: {
    background: "linear-gradient(45deg, #ff6b95, #ff8fab)",
    color: "white",
    padding: "1.5rem",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    position: "relative",
    fontFamily: '"Playfair Display", serif',
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "0.5rem",
    fontFamily: '"Great Vibes", cursive',
  },
  subtitle: {
    fontSize: "1rem",
    opacity: "0.9",
    fontFamily: '"Cormorant Garamond", serif',
    fontStyle: "italic",
  },
  content: {
    padding: "2.5rem",
    lineHeight: "1.8",
    position: "relative",
    background: "linear-gradient(45deg, #fff, #fff9f9)",
  },
  paragraph: {
    marginBottom: "1.5rem",
    color: "#4a4a4a",
    fontSize: "1.50rem",
    fontFamily: '"Dancing Script", cursive',
    letterSpacing: "1.5px",
  },
  firstLetter: {
    fontSize: "3.5rem",
    float: "left",
    lineHeight: "1",
    marginRight: "8px",
    fontFamily: '"Great Vibes", cursive',
    color: "#ff6b95",
  },
  signature: {
    textAlign: "right",
    fontStyle: "italic",
    color: "#ff6b95",
    marginTop: "3rem",
    fontFamily: '"Great Vibes", cursive',
    fontSize: "1.8rem",
  },
  heart: {
    position: "absolute",
    pointerEvents: "none",
    fontSize: "1.5rem",
  },
  decorativeBorder: {
    position: "absolute",
    top: "10px",
    left: "10px",
    right: "10px",
    bottom: "10px",
    border: "1px solid rgba(255,107,149,0.1)",
    borderRadius: "12px",
    pointerEvents: "none",
  },
};

// Floating hearts animation component (same as before)
const FloatingHeart = ({ delay }) => {
  return (
    <motion.div
      style={{
        ...styles.heart,
        left: `${Math.random() * 100}%`,
      }}
      initial={{ y: "100vh", opacity: 0 }}
      animate={{
        y: "-100vh",
        opacity: [0, 1, 1, 0],
        x: [0, Math.random() * 50 - 25],
        scale: [1, 1.2, 1],
        rotate: [-10, 10],
      }}
      transition={{
        duration: 10,
        delay: delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {["💖", "💝", "💕", "💗"][Math.floor(Math.random() * 4)]}
    </motion.div>
  );
};

const LoveLetter = () => {
  const [letter, setLetter] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showGlitter, setShowGlitter] = useState(false);

  useEffect(() => {
    fetch("/new.txt")
      .then((response) => response.text())
      .then((data) => setLetter(data))
      .catch((error) => console.error("Error loading letter:", error));
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShowGlitter(true);
      const timer = setTimeout(() => setShowGlitter(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const renderParagraph = (text, index) => {
    if (index === 0) {
      // Special styling for the first paragraph
      const firstLetter = text.charAt(0);
      const restOfText = text.slice(1);
      return (
        <motion.p
          key={index}
          style={styles.paragraph}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + index * 0.1 }}
        >
          <span style={styles.firstLetter}>{firstLetter}</span>
          {restOfText}
        </motion.p>
      );
    }
    return (
      <motion.p
        key={index}
        style={styles.paragraph}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 + index * 0.1 }}
      >
        {text}
      </motion.p>
    );
  };

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {isOpen &&
        [...Array(10)].map((_, i) => <FloatingHeart key={i} delay={i * 0.5} />)}

      <motion.div
        style={styles.card}
        initial={{ scale: 0.9, y: 50 }}
        animate={{
          scale: 1,
          y: 0,
          boxShadow: isOpen
            ? "0 20px 50px rgba(255,107,149,0.3)"
            : "0 10px 25px rgba(0,0,0,0.1)",
        }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          style={styles.header}
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            style={styles.title}
            animate={{
              y: isOpen ? 0 : [-20, 0],
              scale: isOpen ? 1 : [0.8, 1.1, 1],
            }}
            transition={{ duration: 0.5 }}
          >
            A Special Letter For You 💌
          </motion.div>
          <motion.div
            style={styles.subtitle}
            animate={{ opacity: [0, 1] }}
            transition={{ delay: 0.3 }}
          >
            Click to {isOpen ? "close" : "open"} the letter
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ overflow: "hidden" }}
            >
              <motion.div style={styles.content}>
                <div style={styles.decorativeBorder} />
                {letter
                  .split("\n")
                  .map((paragraph, index) => renderParagraph(paragraph, index))}

                <motion.div
                  style={styles.signature}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  With all my love ❤️
                  <motion.span
                    style={{ display: "inline-block", marginLeft: "5px" }}
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    💝
                  </motion.span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glitter effect */}
        <AnimatePresence>
          {showGlitter && (
            <motion.div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                pointerEvents: "none",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  style={{
                    position: "absolute",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "white",
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    x: [0, (Math.random() - 0.5) * 100],
                    y: [0, (Math.random() - 0.5) * 100],
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.02,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default LoveLetter;
