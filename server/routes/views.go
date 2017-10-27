package routes

import (
	"net/http"

	"github.com/labstack/echo"
)

func viewIndex(c echo.Context) error {
	return c.Render(http.StatusOK, "index.html", map[string]interface{}{
		"month": "九月",
		"year":  "二零一七年",
	})
}
func viewAbout(c echo.Context) error {
	return c.Render(http.StatusOK, "about.html", map[string]interface{}{
		"month": "九月",
		"year":  "二零一七年",
	})
}
func viewArchive(c echo.Context) error {
	return c.Render(http.StatusOK, "archive.html", map[string]interface{}{
		"month": "九月",
		"year":  "二零一七年",
	})
}

func viewTags(c echo.Context) error {
	return c.Render(http.StatusOK, "tags.html", map[string]interface{}{
		"month": "九月",
		"year":  "二零一七年",
	})
}

var ViewRoute []Route = []Route{
	Route{Method: "GET", URL: "/", Handler: viewIndex},
	Route{Method: "GET", URL: "/about", Handler: viewAbout},
	Route{Method: "GET", URL: "/archive", Handler: viewArchive},
	Route{Method: "GET", URL: "/tags", Handler: viewTags},
}

// e.GET("/index", func)
// })
