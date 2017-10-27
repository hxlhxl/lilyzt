package config

import (
	"github.com/labstack/echo"
)

func InitStatic(e *echo.Echo) {
	e.Static("/debug", "debug")
}
