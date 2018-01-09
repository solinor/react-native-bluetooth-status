Pod::Spec.new do |s|
  s.name         = "react-native-bluetooth-status"
  s.version      = "1.1.3"
  s.summary      = "Get bluetooth status of a device"
  s.homepage     = "https://github.com/solinor/react-native-bluetooth-status"
  s.author       = "Solinor Oy"

  s.license      = "MIT"
  s.platform     = :ios, "7.0"


  s.source       = { :git => "https://github.com/solinor/react-native-bluetooth-status", :tag => "v#{s.version.to_s}" }

  s.source_files  = "ios/*.{h,m}"

  s.dependency 'React'
end
