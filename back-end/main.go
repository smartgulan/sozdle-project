package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/mmargullan/sozdle-project/controllers"
)

func main() {
	r := gin.Default()

	config := cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}

	r.Use(cors.New(config))

	// Routes
	r.GET("/", controllers.HandleGuess)
	r.GET("/getWord", controllers.GetWord)
	r.Run(":8080")
}
