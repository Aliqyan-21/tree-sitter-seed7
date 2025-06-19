// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "TreeSitterSeed7",
    products: [
        .library(name: "TreeSitterSeed7", targets: ["TreeSitterSeed7"]),
    ],
    dependencies: [
        .package(url: "https://github.com/ChimeHQ/SwiftTreeSitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterSeed7",
            dependencies: [],
            path: ".",
            sources: [
                "src/parser.c",
                // NOTE: if your language has an external scanner, add it here.
            ],
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterSeed7Tests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterSeed7",
            ],
            path: "bindings/swift/TreeSitterSeed7Tests"
        )
    ],
    cLanguageStandard: .c11
)
