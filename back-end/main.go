package main

import (
	"net/http"
	"unicode"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		word := c.Query("word")
		if wordValidation(word) == false {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid word"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"word": word})
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
