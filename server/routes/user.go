package routes

// Routes
import (
	"net/http"
	"strconv"

	"github.com/labstack/echo"
)

type (
	user struct {
		ID   int    `json:"id"`
		Name string `json:"name"`
	}
)

var (
	users = map[int]*user{}
	seq   = 1
)

func createUser(c echo.Context) error {
	u := &user{
		ID: seq,
	}
	if err := c.Bind(u); err != nil {
		return err
	}
	users[u.ID] = u
	seq++
	return c.JSON(http.StatusCreated, u)
}

func getUser(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	return c.JSON(http.StatusOK, users[id])
}

func updateUser(c echo.Context) error {
	u := new(user)
	if err := c.Bind(u); err != nil {
		return err
	}
	id, _ := strconv.Atoi(c.Param("id"))
	users[id].Name = u.Name
	return c.JSON(http.StatusOK, users[id])
}

func deleteUser(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	delete(users, id)
	return c.NoContent(http.StatusNoContent)
}

var UserRoute []Route = []Route{
	Route{Method: "POST", URL: "/users", Handler: createUser},
	Route{Method: "GET", URL: "/users/:id", Handler: createUser},
	Route{Method: "PUT", URL: "/users/:id", Handler: createUser},
	Route{Method: "DELETE", URL: "/users/:id", Handler: createUser},
}

// e.POST("/users", createUser)
// e.GET("/users/:id", getUser)
// e.PUT("/users/:id", updateUser)
// e.DELETE("/users/:id", deleteUser)
