package routes

// routes.AddRoutes(e)
import (
	"github.com/labstack/echo"
)

type Route struct {
	Method  string
	URL     string
	Handler func(echo.Context) error
}

var _routes [][]Route = [][]Route{UserRoute, ViewRoute}

func InitRoute(e *echo.Echo) {
	for _, r := range _routes {
		for _, route := range r {
			switch route.Method {
			case "GET":
				e.GET(route.URL, route.Handler)
			case "POST":
				e.POST(route.URL, route.Handler)
			case "PUT":
				e.PUT(route.URL, route.Handler)
			case "DELETE":
				e.DELETE(route.URL, route.Handler)
			}
		}
	}
	return
}
