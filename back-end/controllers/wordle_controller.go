package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mmargullan/sozdle-project/models"
)

var target string

func init() {
	models.LoadWords("words.txt")
	target = models.GetRandomWord()
}

func HandleGuess(c *gin.Context) {
	word := c.Query("word")

	if !models.WordValidation(word) || !models.WordCheck(word) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid word"})
		return
	}

	result := models.Compare(word, target)
	c.JSON(http.StatusOK, gin.H{"result": result})
}

func GetWord(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"word": target})
}
