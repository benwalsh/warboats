# frozen_string_literal: true
# -*- mode: ruby -*-
# vi: set ft=ruby :

# rubocop:disable UselessAssignment
project_dir_on_host = Dir.pwd
# rubocop:enable UselessAssignment

Vagrant.configure(2) do |config|
  config.vm.box = 'warboats'
  config.vm.network(:private_network, ip: '10.11.13.13')
  config.vm.network(:forwarded_port, guest: 3000, host: 5555)
  config.vm.synced_folder(ENV['HOME'], '/hosthome')
  config.vm.synced_folder('.', '/vagrant', type: 'nfs')
  config.ssh.forward_agent = true

  config.vm.provider(:virtualbox) do |vb|
    vb.customize ['modifyvm', :id, '--memory', 4096]
    vb.customize ['modifyvm', :id, '--cpus', 4]
    vb.customize ['guestproperty', 'set', :id, '/VirtualBox/GuestAdd/VBoxService/--timesync-set-threshold', 10_000]
  end
end
