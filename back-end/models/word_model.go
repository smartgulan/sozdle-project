package models

import (
	"bufio"
	"math/rand"
	"os"
	"strings"
	"unicode"
)

var words map[string]bool

func init() {
	words = make(map[string]bool)
}

func LoadWords(filename string) {
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

func WordValidation(word string) bool {
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

func WordCheck(word string) bool {
	return words[word]
}

func GetRandomWord() string {
	if len(words) == 0 {
		return ""
	}
	keys := make([]string, 0, len(words))
	for key := range words {
		keys = append(keys, key)
	}
	randomIndex := rand.Intn(len(keys))
	return keys[randomIndex]
}

func Compare(word string, target string) (result [5]int) {
	for i := 0; i < len(word); i++ {
		if word[i] == target[i] {
			result[i] = 1
		} else if HasLetter(target, rune(word[i])) {
			result[i] = 0
		} else {
			result[i] = -1
		}
	}
	return result
}

func HasLetter(word string, letter rune) bool {
	for _, char := range word {
		if char == letter {
			return true
		}
	}
	return false
}
