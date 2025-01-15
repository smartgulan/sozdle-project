package main

import (
	"github.com/gin-gonic/gin"
	"github.com/mmargullan/sozdle-project/controllers"
)

func main() {
	r := gin.Default()

	// Routes
	r.GET("/", controllers.HandleGuess)
	r.Run(":8080")
}
