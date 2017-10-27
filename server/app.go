package main

import (
	"fmt"
	config "lilyzt/server/config"
	middleware "lilyzt/server/middleware"
	routes "lilyzt/server/routes"
	utils "lilyzt/server/utils"
	"log"

	"github.com/labstack/echo"
)

func main() {
	// 对数据进行操作
	utils.InitDB()
	db, err := utils.GetDbConn("local-uic")
	defer db.Close()
	if err != nil {
		log.Fatal("数据库连接错误", err)
	}
	rows, _ := db.Query("select * from user;")
	cols, _ := rows.Columns()
	vals := make([][]byte, len(cols))
	scans := make([]interface{}, len(cols))
	for k, _ := range vals {
		scans[k] = &vals[k]
	}

	i := 0
	result := make(map[int]map[string]string)
	for rows.Next() {
		//填充数据
		rows.Scan(scans...)
		//每行数据
		row := make(map[string]string)
		//把vals中的数据复制到row中
		for k, v := range vals {
			key := cols[k]
			//这里把[]byte数据转成string
			row[key] = string(v)
		}
		//放入结果集
		result[i] = row
		i++
	}
	for k, v := range result {
		fmt.Println(k, v)
	}
	fmt.Println(result)

	// for rows.Next() {
	// 	rows.Scan()
	// }

	e := echo.New()
	config.InitConfig(e)
	middleware.InitMiddleware(e)
	routes.InitRoute(e)
	e.Logger.Fatal(e.Start(":1323"))
}
