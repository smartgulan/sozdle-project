package main

import (
	"bufio"
	"fmt"
	"math/rand"
	"net/http"
	"os"
	"strings"
	"unicode"

	"github.com/gin-gonic/gin"
)

var words map[string]bool

func main() {
	words = make(map[string]bool)
	loadWords("words.txt")
	target := getRandomWord()
	fmt.Println("Target word:", target)

	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		word := c.Query("word")
		if !wordValidation(word) || !wordCheck(word) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid word"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"result": compare(word, target)})
	})

	r.Run(":8080")
}

func wordValidation(word string) bool {
	if len(word) != 5 {
		return false
	}
	for _, char := range word {
		if unicode.IsDigit(char) {
			return false
		}
	}
	return true
}

func loadWords(filename string) {
	file, err := os.Open(filename)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		word := strings.TrimSpace(scanner.Text())
		words[word] = true
	}

	if err := scanner.Err(); err != nil {
		panic(err)
	}
}

func getRandomWord() string {
	if len(words) == 0 {
		return ""
	}
	keys := make([]string, 0, len(words))
	for key := range words {
		keys = append(keys, key)
	}
	randomIndex := rand.Intn(2315)
	return keys[randomIndex]
}

func compare(word string, target string) (result [5]int) {
	for i := 0; i < len(word); i++ {
		if word[i] == target[i] {
			result[i] = 1
		} else if hasLetter(target, rune(word[i])) {
			result[i] = 0
		} else {
			result[i] = -1
		}
	}
	return result
}

func hasLetter(word string, letter rune) bool {
	for _, char := range word {
		if char == letter {
			return true
		}
	}
	return false
}

func wordCheck(word string) bool {
	return words[word]
}
