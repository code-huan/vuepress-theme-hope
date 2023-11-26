---
title: warp安装以及xray分流
# 这是页面的图标
icon: file #lightbulb
# 这是侧边栏的顺序
order: 1
author: JackHuan
date: 2023-11-24
# 一个页面可以有多个分类
category:
  - vps
# 一个页面可以有多个标签
tag:
  - warp
  - xray
  - 分流
# 此页面会在文章列表置顶
sticky: true
# 此页面会出现在文章收藏中
star: true
footer: JackHuan
copyright: 版权所有 © 2023-present JackHuan
---

`more` 

<!-- more -->

## 介绍

# 系统环境 debian

## 安装配置Warp
### 安装warp
```
# Add cloudflare gpg key
curl https://pkg.cloudflareclient.com/pubkey.gpg | sudo gpg --yes --dearmor --output /usr/share/keyrings/cloudflare-warp-archive-keyring.gpg

# Add this repo to your apt repositories
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/cloudflare-warp-archive-keyring.gpg] https://pkg.cloudflareclient.com/ $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/cloudflare-client.list

# Install
sudo apt-get update && sudo apt-get install cloudflare-warp
```
> 其他系统安装可见官方 https://pkg.cloudflareclient.com/

### 配置warp
配置Warp 准备一个license，默认的license只能免费1GB的流量, 在 Telegram 上搜索 @generatewarpplusbot 关注， 输入 /generate 获取一个很大流量的 license （有多大？应该是一辈子用不完吧）

```shell
warp-cli register
warp-cli set-license xxx # 把 xxx 替换成你刚刚获取到的 license
warp-cli set-mode proxy
warp-cli set-proxy-port 40000
warp-cli connect
```

### 检查warp状态
```
~$ warp-cli  status
Success
Status update: Connected
```

### 测试一下
```
~$ curl https://www.cloudflare.com/cdn-cgi/trace --socks5 127.0.0.1:40000
fl=618f10
h=www.cloudflare.com
ip=104.28.195.185
ts=1688194441.214
visit_scheme=https
uag=curl/7.58.0
colo=LAX
sliver=none
http=http/2
loc=US
tls=TLSv1.3
sni=plaintext
warp=plus
gateway=off
rbi=off
kex=X25519

# 40000记得换成设定的端口
~$ curl -4 ip.gs -x socks5://127.0.0.1:40000

~$ curl -6 ip.gs -x socks5://127.0.0.1:40000
```

![image](https://github.com/code-huan/warp_wireguard/assets/67494479/ad7c9a19-6fda-4a12-9bba-586f55e1284d)

### 最后执行
```
warp-cli enable-always-on
```
至此，warp-cli的部分就大功告成。

## 配置 xray 的服务器

```
# 1.在 outbounds 里新增一个 warp proxy 的出口

{
    "tag": "warp",
    "protocol": "socks",
    "settings": {
	        "servers": [{
	            "address": "127.0.0.1",
	            "port": 40000
	        }]
    	}
}

# 2.在 routing 里添加 routing 的规则, 在 routing -> rules 里添加 针对 chat.openai.com, openai.com, netflix 的路由规则

{
        "outboundTag": "warp",       
        "type": "field",
        "domain": [
	        "chat.openai.com", 
	        "openai.com",
	        "geosite:netflix",
	        "geosite:openai"
	    ]
 }
```
最后，重启 xray server,访问刚刚配置的网址。
至此，配置 xray 的服务器的大功告成



> (可选)或配置 wireguard
```
# 1.一键脚本，配置ipv6,选择 4. 安装 WireGuard 相关组件  6. 自动配置 WARP WireGuard IPv6 网络
~$ bash <(curl -fsSL git.io/warp.sh) menu

# 显示如下:
Cloudflare WARP 一键安装脚本 [beta39] by P3TERX.COM

 -------------------------
 WARP 客户端状态 : 运行中
 SOCKS5 代理端口 : 40000
 -------------------------
 WireGuard 状态 : 运行中
 IPv4 网络状态  : 正常
 IPv6 网络状态  : WARP
 -------------------------

 1. 安装 Cloudflare WARP 官方客户端
 2. 自动配置 WARP 客户端 SOCKS5 代理
 3. 管理 Cloudflare WARP 官方客户端
 -
 4. 安装 WireGuard 相关组件
 5. 自动配置 WARP WireGuard IPv4 网络
 6. 自动配置 WARP WireGuard IPv6 网络
 7. 自动配置 WARP WireGuard 双栈全局网络
 8. 管理 WARP WireGuard 网络


# 2.在"outbounds"区域，加入一个新的出口

    {
            "tag":"wireguard",
            "protocol": "freedom",
            "settings": {
              "domainStrategy": "UseIPv6" // 指定使用 IPv6
        }
    }

# 3.在 routing 里添加 routing 的规则, 在 routing -> rules 里添加 针对 chat.openai.com, openai.com, netflix 的路由规则

{
        "outboundTag": "wireguard",       
        "type": "field",
        "domain": [
	        "chat.openai.com", 
	        "openai.com",
	        "geosite:netflix",
	        "geosite:openai"
	    ]
 }
```





> 本文参考文章
> 
> [巧用 Warp plus 解锁 chatgpt](https://macgeeker.com/linux/warp/);
>
> [wireguard 使用不限流量的cloudflare VPN并且自选IP](https://duangks.com/archives/124/);
> 
> [wireguard 官网安装地址](https://www.wireguard.com/install/);

