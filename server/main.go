package main

import (
	"fmt"
	"log"
	//"fmt"

	_ "lilyzt/server/routes"

	"github.com/hxlhxl/go-utils/http"
	"github.com/hxlhxl/go-utils/vary"
)

var (
	GO_ENV string
)

func prevStart() {
	// 环境设置
	var err error
	GO_ENV, err = vary.GetEnv("GO_ENV")
	if err != nil {
		log.Println("未设置环境变量，默认以development设置a")
	}
	return
}

func main() {
	var (
		ip, port, static string
	)
	prevStart()
	if GO_ENV == "development" {
		ip = "0.0.0.0"
		port = "9998"
		static = "views"
	} else {
		ip = "127.0.0.1"
		port = "9997"
		static = "views"
	}
	fmt.Println(static)
	httpShell := http.InitHttpShell(ip, port)
	httpShell.InitStaticPath("/", "views")
	httpShell.Start()
}
