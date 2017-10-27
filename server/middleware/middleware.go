package appMiddleware

import (
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func InitMiddleware(e *echo.Echo) {
	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
}
