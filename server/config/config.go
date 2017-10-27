package config

import (
	"github.com/labstack/echo"
)

func InitConfig(e *echo.Echo) {
	InitRenderer(e)
	InitStatic(e)
}
