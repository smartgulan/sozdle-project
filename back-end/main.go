package main

import (
	"github.com/gin-gonic/gin"
	"github.com/mmargullan/sozdle-project/controllers"
)

func main() {
	r := gin.Default()

	// Routes
	r.GET("/", controllers.HandleGuess)
	r.GET("/getWord", controllers.GetWord)
	r.Run(":8080")
}
