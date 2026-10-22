package com.homechart.backend.user;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User createUser(UserRequest request) {
        User user = new User();

        user.setEmail(request.email().trim());
        user.setDisplayName(request.displayName().trim());

        return userRepository.save(user);
    }
}