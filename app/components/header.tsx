'use client'
import React from 'react'
import { Container, Dropdown, Nav, Navbar } from 'react-bootstrap';

interface ThemeProps {
    theme: 'light' | 'dark' | 'auto';
    onThemeChange: (theme: 'light' | 'dark' | 'auto') => void;
}

const Header = ({ theme, onThemeChange }: ThemeProps) => {

    return (
        <Navbar className='sticky-top' expand="lg" bg={theme === 'dark' ? 'dark' : 'light'} variant={theme === 'dark' ? 'dark' : 'light'}>
            <Container>
                <Navbar.Brand href="#">AmiAiLab</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/about">About</Nav.Link>
                    </Nav>
                    <form className="d-flex" role="search">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>
                    <Nav className="ml-auto ms-2">
                        <Dropdown>
                            <Dropdown.Toggle variant={theme === 'dark' ? 'dark' : 'light'} id="dropdown-theme-toggle">
                                {theme === 'light' ? <i className="bi bi-sun"></i> : theme === 'dark' ? <i className="bi bi-moon-stars-fill"></i> : <i className="bi bi-circle-half"></i>}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => onThemeChange('light')} active={theme === 'light'}>
                                    <i className="bi bi-sun"></i> Light
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => onThemeChange('dark')} active={theme === 'dark'}>
                                    <i className="bi bi-moon-stars-fill"></i> Dark
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => onThemeChange('auto')} active={theme === 'auto'}>
                                    <i className="bi bi-circle-half"></i> Auto
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>


                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header