package routes

import (
	"fmt"
	"net/http"

	lilyhttp "github.com/hxlhxl/go-utils/http"
)

// 写法很丑，还需要内置的http包，非常的不好看
// type User struct {
// 	lilyhttp.HandlerWrapper
// }
func user(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "user")
}

func init() {
	lilyhttp.InitRoute("/api/v1/user", user)
}
