package main

import (
	"crypto/rand"
)

func hi() {

}

func test() (int, error) {
	return 0, nil
}

func randNum() {
	good, _ := rand.Read(nil)
	println(good)

}
func main() {

}

// SampleCodeG404 - weak random number

// v, _ := test()
// fmt.Println(v)
