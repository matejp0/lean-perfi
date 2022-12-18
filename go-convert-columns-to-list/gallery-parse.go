package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"strings"
)
func main() {
  contents, err := ioutil.ReadFile("imagenames")
  if err != nil {
    log.Fatal(err)
    return
  }

  list := make([][]string, 0)

  for _, line := range strings.Split(string(contents), "\n") {
    list = append(list, strings.Split(line, `", "`))
  }

  list = list[:len(list)-1]

  for i := 0; len(list[len(list)-1]) > 0; i++ {
    fmt.Printf("<figure><img loading='lazy' src='/gallery/comp.%[1]s.jpg' data-image-src='/gallery/%[1]s.jpg' alt='%[1]s'/></figure>\n", strings.ReplaceAll(list[i%3][0], `"`, ""))
    list[i%3] = list[i%3][1:]
  }

}
