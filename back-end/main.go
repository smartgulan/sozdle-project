package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		word := c.Query("word")

		c.JSON(http.StatusOK, gin.H{"word": word})
	})

	r.Run(":8080")
}
