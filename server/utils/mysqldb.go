package utils

import (
	"database/sql"
	"log"
	"sync"

	_ "github.com/go-sql-driver/mysql"
)

var (
	dbLock    sync.RWMutex
	dbConnMap map[string]*sql.DB
)

var DB *sql.DB

func InitDB() {
	var err error
	DB, err = makeDbConn()
	if DB == nil || err != nil {
		log.Fatalln("get db conn fail", err)
	}
	dbConnMap = make(map[string]*sql.DB)
	log.Println("InitDB ok")
}
func GetDbConn(connName string) (c *sql.DB, e error) {
	dbLock.Lock()
	defer dbLock.Unlock()
	var err error
	var dbConn *sql.DB
	dbConn = dbConnMap[connName]
	if dbConn == nil {
		dbConn, err = makeDbConn()
		if dbConn == nil || err != nil {
			closeDbConn(dbConn)
			return nil, err
		}
		dbConnMap[connName] = dbConn
	}
	err = dbConn.Ping()
	if err != nil {
		closeDbConn(dbConn)
		delete(dbConnMap, connName)
		return nil, err
	}
	return dbConn, err
}

func makeDbConn() (conn *sql.DB, err error) {
	conn, err = sql.Open("mysql", "root:@tcp(127.0.0.1:3306)/uic?charset=utf8")
	if err != nil {
		return nil, err
	}
	conn.SetMaxIdleConns(600)
	err = conn.Ping()
	return conn, err
}
func closeDbConn(conn *sql.DB) {
	if conn != nil {
		conn.Close()
	}
}
