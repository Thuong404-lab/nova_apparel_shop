package com.fashion.services.impl;

import com.fashion.components.JwtTokenUtil;
import com.fashion.dtos.LoginDTO;
import com.fashion.models.Customer;
import com.fashion.models.Employee;
import com.fashion.repositories.CustomerRepository;
import com.fashion.repositories.EmployeeRepository;
import com.fashion.responses.AuthResponse;
import com.fashion.responses.UserResponse;
import com.fashion.services.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;

    public AuthServiceImpl(CustomerRepository customerRepository, EmployeeRepository employeeRepository, PasswordEncoder passwordEncoder, JwtTokenUtil jwtTokenUtil) {
        this.customerRepository = customerRepository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @Override
    public AuthResponse login(LoginDTO loginDTO) {
        String input = loginDTO.getUserName().trim();
        String rawPassword = loginDTO.getPassword();

        // check member
        Optional<Customer> optionalCustomer = customerRepository.findByUsername(input);
        if (optionalCustomer.isEmpty()) {
            optionalCustomer = customerRepository.findByEmail(input);
        }


        if (optionalCustomer.isPresent()) {
            Customer customer = optionalCustomer.get();
            if (!passwordEncoder.matches(rawPassword, customer.getPasswordHash()))
                throw new RuntimeException("Tên đăng nhập hoặc mật khẩu không đúng");
            if (!"Active".equalsIgnoreCase(customer.getStatus()))
                throw new RuntimeException("Tài khoản của bạn bị khóa hoặc chưa kích hoạt");

            // Tạo token
            String token = jwtTokenUtil.generateToken(customer.getCustomerId(), customer.getUsername(), "Customer");

            UserResponse userResponse = UserResponse.builder()
                    .id(customer.getCustomerId())
                    .userName(customer.getUsername())
                    .fullName((customer.getFullName()))
                    .email(customer.getEmail())
                    .phone(customer.getPhone())
                    .role("Customer")
                    .status(customer.getStatus())
                    .avatar(customer.getAvatar())
                    .build();

            return AuthResponse.builder()
                    .success(true)
                    .message("Đăng nhập thành công")
                    .token(token)
                    .user(userResponse)
                    .build();
        }

        // Check staff/admin
        Optional<Employee> optionalEmployee = employeeRepository.findByUsername(input);
        if (optionalEmployee.isEmpty()) {
            optionalEmployee = employeeRepository.findByEmail(input);
        }

        if (optionalEmployee.isPresent()) {
            Employee employee = optionalEmployee.get();
            if (!passwordEncoder.matches(rawPassword, employee.getPasswordHash()))
                throw new RuntimeException("Tên đăng nhập hoặc mật khẩu sai");

            if (!"Active".equalsIgnoreCase(employee.getStatus()))
                throw new RuntimeException("Tài khoản bị vô hiệu hóa hoặc không tồn tại");

            String token = jwtTokenUtil.generateToken(employee.getEmployeeId(), employee.getUsername(), employee.getRole());

            UserResponse userResponse = UserResponse.builder()
                    .id(employee.getEmployeeId())
                    .userName((employee.getUsername()))
                    .fullName(employee.getFullName())
                    .email(employee.getEmail())
                    .phone(employee.getPhone())
                    .role(employee.getRole())
                    .avatar(employee.getAvatar())
                    .status(employee.getStatus())
                    .build();
            return AuthResponse.builder()
                    .message("Đăng nhập thành công")
                    .success(true)
                    .token(token)
                    .user(userResponse)
                    .build();
        }
        throw new RuntimeException("Tên đăng nhập hoặc mật khẩu không chính xác!");
    }
}
