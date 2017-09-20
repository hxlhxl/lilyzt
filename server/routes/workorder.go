package routes

import (
	"fmt"
	"net/http"

	lilyhttp "github.com/hxlhxl/go-utils/http"
)

func workorder(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "workorder")
}

func init() {
	lilyhttp.InitRoute("/api/v1/workorder", workorder)
}
