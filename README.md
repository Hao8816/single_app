myapp

this is my app node

关于缓存优化：

1.直接读取数据库，68.22kb的数据耗时126ms
GET /style/images/number9.png 304 0ms
----read from redis ----
----read from mysql ----
----get result----
POST /ajax/get_category_good_list/ 200 126ms - 68.22kb
POST /ajax/start/ 200 4ms - 194b
GET /single/category/ 200 6ms - 11.38kb

2.从redis缓存里面读取数据，68.22kb耗时9ms
----read from redis ----
----return result from redis ----
----get result----
POST /ajax/get_category_good_list/ 200 9ms - 68.22kb
POST /ajax/start/ 200 1ms - 194b


