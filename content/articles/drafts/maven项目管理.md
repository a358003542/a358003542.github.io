Title: java语言之-maven项目管理
Slug: maven
Date: 2018-07-30
Modified: 2018-07-30
Tags: maven
Status: draft
[TOC]

## 安装和使用

如果读者是使用的 IntelliJ IDEA 的话，maven的安装和使用是不需要费什么心思的，具体常用命令在右边插件哪里点一下就可以了。读者想要了解得更相信，请参阅参考资料1里面的讲解了解下。

在改变某个ndarray对象的dtype的时候，原ndarray对象实际上被删除了，等于重新创建了一个ndarray对象。可以通过上面的类型声明来直接进行转换，如:

    >>> t = np.array([1,2,3],dtype='int8')
    >>> t.dtype
    dtype('int8')
    >>> new_t = np.int32(t)
    >>> new_t.dtype
    dtype('int32')
## src文件夹下

src文件夹下放着你的java源码，一般结构如下：

```
src
├── main
│   └── java
│       └── work
│           └── cdwanze
│               └── BihuNLP.java
└── test
    └── java
        └── work
            └── cdwanze
                └── BihuNLPTest.java
```

## pom.xml文件

这个文件基本内容一般都大同小异，一开始稍作修改即可，后面再考虑更多功能的定制。

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>work.cdwanze</groupId>
    <artifactId>bihu</artifactId>
    <version>0.0.1</version>

    <name>BihuNLP</name>
    <url>http://www.cdwanze.work/</url>
    <description>
        Bihu系统nlp功能java包
    </description>
    <organization>
        <name>cdwanze</name>
        <url>http://www.cdwanze.work/</url>
    </organization>

    <inceptionYear>2018</inceptionYear>
    <developers>
        <developer>
            <name>cdwanze</name>
            <email>a358003542@outlook.com</email>
            <url>http://www.cdwanze.work</url>
        </developer>
    </developers>

    <build>
        <plugins>
            <!-- 编译插件, 设定JDK版本 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>${maven-compiler-plugin.version}</version>
                <configuration>
                    <encoding>${project.build.sourceEncoding}</encoding>
                    <source>${java.version}</source>
                    <target>${java.version}</target>
                    <showDeprecation>true</showDeprecation>
                    <showWarnings>true</showWarnings>
                    <debug>true</debug>
                </configuration>
            </plugin>
            <!-- 打包插件，排除语料库和语料库工具以及日志配置文件 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>${maven-jar-plugin.version}</version>
                <configuration>
                    <excludes>
                        <exclude>**/*.properties</exclude>
                    </excludes>
                </configuration>
            </plugin>
            <!-- resource插件, 设定编码 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-resources-plugin</artifactId>
                <version>${maven-resources-plugin.version}</version>
                <configuration>
                    <encoding>${project.build.sourceEncoding}</encoding>
                </configuration>
            </plugin>
            <!-- source插件,打包源码 -->
            <plugin>
                <artifactId>maven-source-plugin</artifactId>
                <version>${maven-source-plugin.version}</version>
                <executions>
                    <execution>
                        <id>attach-sources</id>
                        <goals>
                            <goal>jar</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <!-- failsafe插件，跳过测试-->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-failsafe-plugin</artifactId>
                <version>2.18.1</version>
                <configuration>
                    <skipTests>true</skipTests>
                </configuration>
            </plugin>
            <!--surefire插件，避免mvn test console乱码-->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>2.21.0</version>
                <configuration>
                    <forkMode>once</forkMode>
                    <argLine>-Dfile.encoding=UTF-8</argLine>
                </configuration>
            </plugin>
        </plugins>
    </build>
    <properties>
        <java.version>1.8</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>

        <maven-compiler-plugin.version>3.0</maven-compiler-plugin.version>
        <maven-jar-plugin.version>2.4</maven-jar-plugin.version>
        <maven-resources-plugin.version>2.7</maven-resources-plugin.version>
        <maven-source-plugin.version>2.4</maven-source-plugin.version>

        <junit.version>4.11</junit.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>

```







## 参考资料

1. [慕课网maven教程](https://www.imooc.com/learn/443)



